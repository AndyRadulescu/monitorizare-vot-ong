using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using MonitorizareVot.Domain.Ong.Models;
using MonitorizareVot.Ong.Api.ViewModels;
using MonitorizareVot.Ong.Api.Extensions;
using System.Linq;

namespace MonitorizareVot.Ong.Api.Queries
{
    public class PollingStationPaginatedHandler : IRequestHandler<PollingStationPaginatedQuery, List<PollingStationView>>
    {
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly VoteMonitorContext _context;

        public PollingStationPaginatedHandler(ILogger logger, IMapper mapper, VoteMonitorContext context)
        {
            this._logger = logger;
            this._mapper = mapper;
            this._context = context;
        }
        public Task<List<PollingStationView>> Handle(PollingStationPaginatedQuery request, CancellationToken cancellationToken)
        {
            var pollingStations = _context.PollingStations
                        .Select(p => _mapper.Map<PollingStationView>(p))
                        .ToList();
            return Task.FromResult(pollingStations.Paginate(request.PageNumber, request.PageSize));
        }
    }
}